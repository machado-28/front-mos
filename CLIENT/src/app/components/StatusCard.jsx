import { ExpandLess, StarOutline, TrendingUp } from "@mui/icons-material";
import { Card, Fab, Grid, lighten, styled, useTheme } from "@mui/material";

// STYLED COMPONENTS
const ContentBox = styled("div")(() => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
}));

const FabIcon = styled(Fab)(() => ({
    width: "44px !important",
    height: "44px !important",
    boxShadow: "none !important"
}));

const H3 = styled("h3")(() => ({
    margin: 0,
    fontWeight: "500",
    marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
    margin: 0,
    flexGrow: 1,
    color: theme.palette.text.secondary
}));

const Span = styled("span")(() => ({
    fontSize: "13px",
    marginLeft: "4px"
}));

const IconBox = styled("div")(() => ({
    width: 16,
    height: 16,
    color: "#fff",
    display: "flex",
    overflow: "hidden",
    borderRadius: "300px ",
    justifyContent: "center",
    "& .icon": { fontSize: "14px" }
}));

export default function StatusCard({ data = [
    {
        title: "visto de Turismo", total: 20,
        icon: <TrendingUp color="success" />,
        total: 33,
        percent: 12

    },
    {
        title: "visto de Turismo", total: 20,
        icon: <TrendingUp color="success" />,
        total: 33,
        percent: 12

    },
    {
        title: "visto de Trabalho", total: 20,
        icon: <ExpandLess className="icon" />,
        total: 33,
        percent: 24

    }

] }) {
    const { palette } = useTheme();
    const bgError = lighten(palette.error.main, 0.85);

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>

            {data?.map((card, index) => {
                return (
                    <Grid item xs={12} md={6}>
                        <Card elevation={3} sx={{ p: 2 }}>
                            <ContentBox>
                                <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
                                    <TrendingUp color="success" />
                                </FabIcon>

                                <H3 color="#08ad6c">{card?.title}</H3>
                            </ContentBox>

                            <ContentBox sx={{ pt: 2 }}>
                                <H1>{card?.total}</H1>

                                <IconBox sx={{ backgroundColor: "success.main" }}>
                                    {card?.icon}
                                </IconBox>

                                <Span color="#08ad6c">(+{card?.percent}%)</Span>
                            </ContentBox>
                        </Card>
                    </Grid>

                )
            })}
        </Grid>
    );
}
