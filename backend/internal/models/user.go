package models

type User struct {
	ID        int    `json:"id" db:"id"`
	Username  string `json:"username" db:"username"`
	Email     string `json:"email" db:"email"`
	Password  string `json:"password" db:"password"`
	Role      string `json:"role" db:"role"` // admin | author | reviewer
	IsBlocked bool   `json:"is_blocked" db:"is_blocked"`
}
