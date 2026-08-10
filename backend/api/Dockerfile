FROM rust:1.70
WORKDIR /app
COPY . .
RUN cargo build --release
EXPOSE 3000
CMD ["./target/release/api"]