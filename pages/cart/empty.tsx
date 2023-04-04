import NextLink from 'next/link';

import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";


const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vaciò" pageDescription="No hay artìculos en el carrito de compras">
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row'}}}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100}}/>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography>Su carrito esta vació</Typography>
          <NextLink href='/' passHref>
            <Link typography="h4" color='secondary'>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage;
