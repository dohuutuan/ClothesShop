using System.ComponentModel.DataAnnotations;

namespace ClothesShop.Models
{
    public class ProductDescription
    {
        [Key]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        [MaxLength(100)]
        public string Introduction { get; set; }
        [MaxLength(100)]
        public string Technology { get; set; }
        [MaxLength(100)]
        public string Material { get; set; }
        [MaxLength(100)]
        public string Style { get; set; }
        [MaxLength(100)]
        public string SuitableFor { get; set; }
        [MaxLength(100)]
        public string Feature { get; set; }



    }
}
