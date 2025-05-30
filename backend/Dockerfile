FROM golang:1.23-alpine AS builder 

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY ./backend ./backend

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/mainapp ./backend/cmd

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/mainapp .
EXPOSE 8080
CMD ["/app/mainapp"]