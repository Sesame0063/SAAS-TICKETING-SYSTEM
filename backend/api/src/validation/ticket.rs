use validator::Validate;

#[derive(Debug, Validate)]
pub struct TicketValidation {
    #[validate(length(min = 5, max = 150))]
    pub title: String,

    #[validate(length(min = 10))]
    pub description: String,
}
