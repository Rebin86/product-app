import { useProduct } from "../hooks/useProduct";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/GridLegacy";
import {
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Chip,
  Rating,
  Divider,
  CardMedia,
  ImageList,
  ImageListItem,
} from "@mui/material";


function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);



  return (
    <Stack spacing={2.5}>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography
          component={RouterLink}
          to="/products"
          sx={{ textDecoration: "none", color: "text.secondary" }}
        >
          Products
        </Typography>
        <Typography color="text.primary">{product?.title ?? `#${id}`}</Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="text" component={RouterLink} to="/products">
          Back to list
        </Button>
      </Stack>

      {loading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Loading product…
          </Typography>
        </Stack>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Sorry — we couldn’t load this product. ({error})
        </Alert>
      )}

      {!loading && !error && product && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <CardMedia
                component="img"
                image={product.images?.[0] ?? product.thumbnail}
                alt={product.title}
                sx={{ borderRadius: 2, maxHeight: 420, objectFit: "cover" }}
              />

              {Array.isArray(product.images) && product.images.length > 1 && (
                <ImageList cols={3} gap={8} sx={{ mt: 1.5 }}>
                  {product.images.slice(0, 6).map((src) => (
                    <ImageListItem key={src}>
                      <img
                        src={src}
                        alt={product.title}
                        loading="lazy"
                        style={{ borderRadius: 10, height: 90, objectFit: "cover", width: "100%" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {product.title}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={product.brand} />
                  <Chip variant="outlined" label={product.category} />
                  {product.stock > 0 ? (
                    <Chip color="success" label={`In stock: ${product.stock}`} />
                  ) : (
                    <Chip color="warning" label="Out of stock" />
                  )}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={product.rating} precision={0.1} readOnly />
                  <Typography color="text.secondary">{product.rating.toFixed(1)}</Typography>
                </Stack>

                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {product.description}
                </Typography>

                <Divider />

                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      ${product.price}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {product.discountPercentage}%
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button variant="contained" onClick={() => navigate("/products")} sx={{ borderRadius: 999 }}>
                    Continue browsing
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => alert("Added to cart (demo)")}
                    sx={{ borderRadius: 999 }}
                  >
                    Add to cart
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
export default ProductDetailsPage;

