use validator::Validate;

#[derive(Debug, Validate)]
pub struct UpdateUserValidation {
    #[validate(length(min = 2, max = 50))]
    pub first_name: String,

    #[validate(length(min = 2, max = 50))]
    pub last_name: String,
}
