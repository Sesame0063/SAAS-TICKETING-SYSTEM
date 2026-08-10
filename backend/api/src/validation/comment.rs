use validator::Validate;

#[derive(Debug, Validate)]
pub struct CommentValidation {
    #[validate(length(min = 1, max = 5000))]
    pub content: String,
}
