use anyhow::Result;
use printpdf::{
    BuiltinFont, Mm, Op, PdfDocument, PdfFontHandle, PdfPage, PdfSaveOptions, Pt, TextItem,
};
use sqlx::PgPool;

use crate::{
    dto::report::{AgentReportDto, CustomerReportDto, DashboardReportDto},
    repositories::report_repository::ReportRepository,
    utils::csv::write_csv,
};

pub struct ReportService;

impl ReportService {
    pub async fn dashboard_report(pool: &PgPool) -> Result<DashboardReportDto> {
        ReportRepository::dashboard(pool).await
    }

    pub async fn agent_report(pool: &PgPool) -> Result<Vec<AgentReportDto>> {
        ReportRepository::agent_report(pool).await
    }

    pub async fn customer_report(pool: &PgPool) -> Result<Vec<CustomerReportDto>> {
        ReportRepository::customer_report(pool).await
    }

    pub async fn export_csv(pool: &PgPool) -> Result<String> {
        let reports = ReportRepository::agent_report(pool).await?;

        let path = "storage/reports/agent_report.csv";

        let mut rows = Vec::new();

        for report in reports {
            rows.push(vec![
                report.agent_id,
                report.assigned_tickets.to_string(),
                report.resolved_tickets.to_string(),
                report.average_resolution_hours.to_string(),
            ]);
        }

        write_csv(
            path,
            &["Agent", "Assigned", "Resolved", "Avg Resolution Hours"],
            rows,
        )?;

        Ok(path.to_string())
    }

    pub async fn export_pdf(pool: &PgPool) -> Result<String> {
        let reports = ReportRepository::agent_report(pool).await?;

        let path = "storage/reports/agent_report.pdf";

        std::fs::create_dir_all("storage/reports")?;

        let mut doc = PdfDocument::new("Agent Report");

        let font = PdfFontHandle::Builtin(BuiltinFont::Helvetica);

        let mut ops = Vec::new();

        ops.push(Op::StartTextSection);

        ops.push(Op::SetFont {
            font: font.clone(),
            size: Pt(20.0),
        });

        ops.push(Op::SetTextCursor {
            pos: printpdf::Point::new(Mm(20.0), Mm(270.0)),
        });

        ops.push(Op::ShowText {
            items: vec![TextItem::Text("Agent Report".to_string())],
        });

        ops.push(Op::SetFont {
            font: font.clone(),
            size: Pt(12.0),
        });

        ops.push(Op::SetTextCursor {
            pos: printpdf::Point::new(Mm(20.0), Mm(250.0)),
        });

        ops.push(Op::ShowText {
            items: vec![TextItem::Text(
                "Agent | Assigned | Resolved | Avg Resolution Hours".to_string(),
            )],
        });

        let mut y = 235.0;

        for report in reports {
            let line = format!(
                "{} | {} | {} | {:.2}",
                report.agent_id,
                report.assigned_tickets,
                report.resolved_tickets,
                report.average_resolution_hours
            );

            ops.push(Op::SetTextCursor {
                pos: printpdf::Point::new(Mm(20.0), Mm(y)),
            });

            ops.push(Op::ShowText {
                items: vec![TextItem::Text(line)],
            });

            y -= 10.0;

            if y < 20.0 {
                break;
            }
        }

        ops.push(Op::EndTextSection);

        let page = PdfPage::new(Mm(210.0), Mm(297.0), ops);

        doc.with_pages(vec![page]);

        let mut warnings = Vec::new();

        let pdf_bytes = doc.save(&PdfSaveOptions::default(), &mut warnings);

        std::fs::write(path, pdf_bytes)?;

        Ok(path.to_string())
    }
}
