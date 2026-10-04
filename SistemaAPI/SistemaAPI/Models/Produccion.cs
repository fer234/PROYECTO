namespace SistemaAPI.Models
{
    public class Produccion
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
    }
}
