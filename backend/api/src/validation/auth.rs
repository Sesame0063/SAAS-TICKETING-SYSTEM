use validator::Validate;

#[derive(Debug, Validate)]
pub struct RegisterValidation {
    #[validate(length(min = 2, max = 50))]
    pub first_name: String,

    #[validate(length(min = 2, max = 50))]
    pub last_name: String,

    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Validate)]
pub struct LoginValidation {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,
}
