namespace SistemaAPI.Models
{
    public class Articulo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
    }
}
