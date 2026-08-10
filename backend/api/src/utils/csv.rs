use anyhow::Result;
use std::fs::File;
use std::io::Write;

pub fn write_csv(path: &str, headers: &[&str], rows: Vec<Vec<String>>) -> Result<()> {
    let mut file = File::create(path)?;

    writeln!(file, "{}", headers.join(","))?;

    for row in rows {
        writeln!(file, "{}", row.join(","))?;
    }

    Ok(())
}
