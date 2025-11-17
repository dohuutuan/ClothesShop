using ClothesShop.DTOs.ResponseDTO;
using ClothesShop.Models;
using ClothesShop.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using X.PagedList.Extensions;

namespace ClothesShop.Repositories
{
    public class FeedbackRepository : Repository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(ClothesShopDbContext context) : base(context)
        {
        }

        public async Task<FeedbackPagedResponseDTO> GetFeedbackByProductId(
            int productId, int page, int limit, string? sort, int? starRating)
        {
            var query = _context.Feedbacks.Include(f => f.User).AsQueryable();
            query = query.Where(f => f.ProductId == productId);
            if (starRating.HasValue && starRating >= 1 && starRating <= 5)
            {
                query = query.Where(f => f.Rating == starRating);
            }
            string sortColumn = "CreatedAt";
            string sortDirection = "asc";
            if (!string.IsNullOrEmpty(sort))
            {
                var part = sort.Split(":");
                if (part.Length == 2)
                {
                    sortColumn = part[0];
                    sortDirection = part[1].Trim().ToLower();
                }
            }
            var sortList = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    { "star", "Rating" },
                    { "created_at", "CreatedAt" }
                };
            if (!sortList.TryGetValue(sortColumn, out var mappedSortColumn))
            {
                mappedSortColumn = "Rating"; // fallback
            }

            query = query.OrderBy($"{mappedSortColumn} {sortDirection}");
            var paged = query.ToPagedList(page, limit);
            return new FeedbackPagedResponseDTO
            {
                Page = page,
                PageSize = limit,
                TotalPages = paged.PageCount,
                TotalItems = paged.TotalItemCount,
                AverageRating = Math.Round(await _context.Feedbacks
                .Where(f => f.ProductId == productId)
                .AverageAsync(f => (double?)f.Rating) ?? 0.0,
                1),
                RatingCount = await _context.Feedbacks
                .Where(f => f.ProductId == productId)
                .CountAsync(),
                Feedbacks = paged.Select(f => new FeedbackResponseDTO
                {
                    UserName = f.User.Fullname,
                    Rating = (int)f.Rating,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt
                }).ToList()
            };

        }
    }
}
