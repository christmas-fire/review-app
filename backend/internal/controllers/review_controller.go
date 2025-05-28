package controllers

import (
	"net/http"
	"strconv"

	"github.com/christmas-fire/review-app/backend/internal/middleware"
	"github.com/christmas-fire/review-app/backend/internal/models"
	"github.com/christmas-fire/review-app/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ReviewController struct {
	service services.Review
}

func NewReviewController(service *services.Service) *ReviewController {
	return &ReviewController{service: service}
}

func (h *ReviewController) CreateReview(c *gin.Context) {
	reviewerIdStr, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var review models.Review
	if err := c.BindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	reviewerId, err := strconv.Atoi(reviewerIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}
	review.ReviewerID = reviewerId

	id, err := h.service.CreateReview(review)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *ReviewController) GetReviewByID(c *gin.Context) {
	_, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	review, err := h.service.GetReviewByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"review": review})
}

func (h *ReviewController) MyReviews(c *gin.Context) {
	idStr, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	reviews, err := h.service.MyReviews(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reviews": reviews})
}
