using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaAPI.Models;
using SistemaAPI.Data;

[Route("api/[controller]")]
[ApiController]
public class ArticulosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ArticulosController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Articulo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Articulo>>> GetArticulo()
    {
        return await _context.Articulos.ToListAsync();
    }

    // GET: api/Articulo/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Articulo>> GetArticulo(int id)
    {
        var articulo = await _context.Articulos.FindAsync(id);

        if (articulo == null)
        {
            return NotFound();
        }

        return articulo;
    }

    // PUT: api/Articulo/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutArticulo(int? id, Articulo articulo)
    {
        if (id != articulo.Id)
        {
            return BadRequest();
        }

        _context.Entry(articulo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ArticuloExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Articulo
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Articulo>> PostArticulo(Articulo articulo)
    {
        _context.Articulos.Add(articulo);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetArticulo", new { id = articulo.Id }, articulo);
    }

    // DELETE: api/Articulo/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArticulo(int? id)
    {
        var articulo = await _context.Articulos.FindAsync(id);
        if (articulo == null)
        {
            return NotFound();
        }

        _context.Articulos.Remove(articulo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ArticuloExists(int? id)
    {
        return _context.Articulos.Any(e => e.Id == id);
    }
}
