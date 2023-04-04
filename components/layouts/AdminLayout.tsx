
import { FC } from "react";
import { SideMenu } from "../ui/SideMenu";
import { AdminNavar } from '../admin/AdminNavbar';
import { Box, Typography } from "@mui/material";

interface Props {
  title:string;
  subTitle: string;
  icon?: JSX.Element;
  children?: React.ReactNode | undefined
}


export const AdminLayout: FC<Props> = ({children, title, subTitle, icon}) => {
  return (
    <>
      <nav>
        <AdminNavar/>
      </nav>
      
      <SideMenu />

      <main style={{
        margin: '80px auto',
        maxWidth: '1440px',
        padding: '0px 30px',
      }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            { icon }
            {' '}
            { title }
          </Typography>
          <Typography variant="h2" sx={{ mb:1 }}>{ subTitle }</Typography>
        </Box>
        <Box className="fadeIn">
        {children}
        </Box>
      </main>

    </>
  )
}
