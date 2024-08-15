import { CAlert, CBadge, CButton, CCard, CCardBody, CCollapse, CSpinner } from '@coreui/react';
import { Avatar, Box, styled, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Paragraph } from 'app/components/Typography';
import React from 'react';
import { useState } from 'react';
import { StatusBadge, VistoBadge } from './function';
import { Collapse } from '@coreui/coreui';

const ProductTable = styled(Table)(() => ({
    minWidth: 400,
    whiteSpace: "pre",
    "& small": {
        width: 50,
        height: 15,
        borderRadius: 500,
        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
    },
    "& td": { borderBottom: "none" },
    "& td:first-of-type": { paddingLeft: "16px !important" }
}));
// import { Container } from './styles';

const ListarEmProjecto = ({ gestores = [{ nome: "ANtonio Machado", telefone: "99999", email: "exemplo@gmail.com" }], visible }) => {

    const [page, setPage] = useState(0);
    const [OrigemId, setOrigemId] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    return (
        <CCollapse visible={visible}>
            <CCard className="mt-3">
                <CCardBody>
                    <CAlert color='info'>
                        aqui estão listadas todas as partes envolvidas neste projecto. todos assuntos, dúvidas e esclarecimentos, dever-se-a contacta-los individualmente, pelos meios de contactos aqui  disponíveis
                    </CAlert>

                    <Box overflow="auto">

                        <ProductTable>
                            <TableHead>
                                <TableRow>

                                    <TableCell colSpan={5} sx={{ px: 2 }}>
                                        Nome
                                    </TableCell>

                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Telefone
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Email
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 2 }}>
                                        Categoria
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{ overflow: "scroll" }}>

                                <>
                                    {gestores
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((gestor, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={5}>
                                                    {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                    <Box display="flex" alignItems="center" gap={3}>
                                                        <Avatar src={gestor?.avatar?.url} />
                                                        <Paragraph style={{ textAlign: "center", fontSize: "0.74rem" }}>   {gestor?.nome}</Paragraph>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                    <Paragraph  >{gestor?.telefone}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                    <Paragraph  >{gestor?.email}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}  >
                                                    <Paragraph  >
                                                        <CBadge className={(gestor.clienteId) ? "bg-success text-white" : "bg-warning text-black"}>{gestor.clienteId ? "Cliente" : "Interno"}</CBadge>
                                                    </Paragraph>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </>

                            </TableBody>
                        </ProductTable>
                        <TablePagination
                            sx={{ px: 2 }}
                            page={page}
                            component="div"
                            rowsPerPage={rowsPerPage}
                            count={gestores?.length}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            nextIconButtonProps={{ "aria-label": "Next Page" }}
                            backIconButtonProps={{ "aria-label": "Previous Page" }}
                        />
                    </Box>
                </CCardBody>
            </CCard>
        </CCollapse>
    )
}

export default ListarEmProjecto;