import { useProducts } from "../hooks/useProducts";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/GridLegacy";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Slider,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";


function ProductsPage() {
  const navigate = useNavigate();
  const { products: allProducts, loading, error } = useProducts();

  // Filters
  const [search, setSearch] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [brand, setBrand] = React.useState<string>("");
  const [minPrice, setMinPrice] = React.useState<string>("");
  const [maxPrice, setMaxPrice] = React.useState<string>("");
  const [minRating, setMinRating] = React.useState<number>(0);
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);


  const categories = React.useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => set.add(p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const brands = React.useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => set.add(p.brand));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const priceBounds = React.useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 1000 };
    let min = Infinity;
    let max = -Infinity;
    for (const p of allProducts) {
      min = Math.min(min, p.price);
      max = Math.max(max, p.price);
    }
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [allProducts]);

  const filteredProducts = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    const minP = minPrice.trim() === "" ? null : Number(minPrice);
    const maxP = maxPrice.trim() === "" ? null : Number(maxPrice);

    return allProducts.filter((p) => {
      if (s && !p.title.toLowerCase().includes(s)) return false;
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;

      if (minP !== null && Number.isFinite(minP) && p.price < minP) return false;
      if (maxP !== null && Number.isFinite(maxP) && p.price > maxP) return false;

      if (minRating > 0 && p.rating < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });
  }, [allProducts, search, category, brand, minPrice, maxPrice, minRating, inStockOnly]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setInStockOnly(false);
  }

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Products
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>

 <Grid container spacing={2.5} alignItems="stretch">
  {/* Row 1 */}
  <Grid item xs={12} md={4}>
    <TextField
      size="small"
      fullWidth
      label="Search by title"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <FormControl fullWidth size="small" sx={{ minWidth: 220 }}>
      <InputLabel id="category-label">Category</InputLabel>
      <Select
        labelId="category-label"
        label="Category"
        value={category}
        onChange={(e) => setCategory(String(e.target.value))}
      >
        <MenuItem value="">
          <em>All categories</em>
        </MenuItem>
        {categories.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <FormControl fullWidth size="small" sx={{ minWidth: 220 }}>
      <InputLabel id="brand-label">Brand</InputLabel>
      <Select
        labelId="brand-label"
        label="Brand"
        value={brand}
        onChange={(e) => setBrand(String(e.target.value))}
      >
        <MenuItem value="">
          <em>All brands</em>
        </MenuItem>
        {brands.map((b) => (
          <MenuItem key={b} value={b}>
            {b}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Row 2 */}
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      size="small"
      fullWidth
      type="number"
      label={`Min price (≥ ${priceBounds.min})`}
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      inputProps={{ min: 0 }}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <TextField
      size="small"
      fullWidth
      type="number"
      label={`Max price (≤ ${priceBounds.max})`}
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
      inputProps={{ min: 0 }}
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <Stack spacing={0.5} sx={{ px: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Minimum rating: {minRating.toFixed(1)}+
      </Typography>
      <Slider
        value={minRating}
        onChange={(_, v) => setMinRating(Number(v))}
        step={0.5}
        min={0}
        max={5}
        valueLabelDisplay="auto"
      />
    </Stack>
  </Grid>

  <Grid item xs={12} md={2}>
    <Stack sx={{ height: "100%" }} justifyContent="center">
      <FormControlLabel
        control={
          <Switch
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
        }
        label="In stock only"
      />
    </Stack>
  </Grid>
</Grid>



          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} of {allProducts.length}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button variant="outlined" onClick={clearFilters}>
              Clear filters
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {loading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Loading products…
          </Typography>
        </Stack>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Sorry — we couldn’t load products right now. ({error})
        </Alert>
      )}

      {!loading && !error && (
  <Grid container spacing={2.5}>
    {filteredProducts.map((p) => (
      <Grid key={p.id} item xs={12} sm={6} md={4} lg={3}>
        <Card
          variant="outlined"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Bilde-ramme */}
          <Box
            sx={{
              height: 200,
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            <Box
              component="img"
              src={p.thumbnail}
              alt={p.title}
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 44, // holder plass så alt blir likt
                }}
              >
                {p.title}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Chip size="small" label={p.brand} />
                <Chip size="small" variant="outlined" label={p.category} />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={p.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {p.rating.toFixed(1)}
                </Typography>
              </Stack>

              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                ${p.price}
              </Typography>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/products/${p.id}`)}
              sx={{ borderRadius: 999 }}
            >
              View details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
)}


      {!loading && !error && filteredProducts.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No products match your filters. Try clearing filters.
        </Alert>
      )}
    </Stack>
  );
}


export default ProductsPage;
