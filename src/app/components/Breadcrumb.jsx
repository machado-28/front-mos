import { NavLink, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Hidden, Icon, styled, useTheme } from "@mui/material";
import { Button } from "@coreui/coreui";
import { CButton } from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";

// STYLED COMPONENTS
const BreadcrumbRoot = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center"
});

const BreadcrumbName = styled("h4")({
  margin: 0,
  fontSize: "16px",
  paddingBottom: "1px",
  verticalAlign: "middle",
  textTransform: "capitalize"
});

const SubName = styled("span")(({ theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const Separator = styled("h4")(({ theme }) => ({
  margin: 0,
  marginLeft: 8,
  paddingBottom: "3px",
  color: theme.palette.text.hint
}));

const StyledIcon = styled(Icon)({
  marginLeft: 8,
  marginBottom: "4px",
  verticalAlign: "middle"
});

export default function Breadcrumb({ routeSegments }) {
  const theme = useTheme();
  const hint = theme.palette.text.hint;
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <BreadcrumbRoot>
      {routeSegments && routeSegments.length > 0 ? (
        <Hidden xsDown>
          <BreadcrumbName>{routeSegments[routeSegments.length - 1].name}</BreadcrumbName>
          <Separator>|</Separator>
        </Hidden>
      ) : null}

      <Breadcrumbs
        separator={<Icon sx={{ color: '#888' }}>navigate_next</Icon>}
        sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>

        <StyledButton onClick={handleBackClick}>
          <StyledIcon color="primary">arrow_back</StyledIcon>
        </StyledButton>

         
      </Breadcrumbs>
    </BreadcrumbRoot>
  );
}
