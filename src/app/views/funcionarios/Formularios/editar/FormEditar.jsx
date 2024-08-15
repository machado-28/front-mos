import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CAlert, CButton, CCol, CForm, CFormInput, CFormSelect, CRow } from "@coreui/react";
import { LoadingButton } from "@mui/lab";
import useAuth from "app/hooks/useAuth";
import { Gestores } from "app/views/Clientes/Gestores/util";
import { Cliente } from "app/views/Clientes/util";
import { Projecto } from "../../util";
import "../style.css";
import { SimpleCard } from 'app/components';
import { useParams } from 'react-router-dom';

const editProjectSchema = z.object({
  nome: z.string().min(1, { message: "Este campo é obrigatorio" }),
  gestoresInternoIds: z.array(z.number()).min(2, 'Selecione pelo menos dois gestores internos'),
  gestoresExternoIds: z.array(z.number()).min(2, 'Selecione pelo menos dois gestores externos'),
  clienteId: z.string().min(1),
});

export default function EditProjectForm() {
  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {}
  });

  const [loading, setLoading] = useState(false);
  const [gestorInterno, setGestorInterno] = useState([]);
  const [gestorExterno, setGestorExterno] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteIdSelected, setClienteId] = useState('');
  const [selectedGestoresInterno, setSelectedGestoresInterno] = useState([]);
  const [selectedGestoresExterno, setSelectedGestoresExterno] = useState([]);

  const { user } = useAuth();
  const { projectoId } = useParams()
  const Gestor = new Gestores();
  const ClienteService = new Cliente();

  useEffect(() => {
    buscarClientes();
    buscarGestorInterno();
    buscarGestores();

    const fetchProjectById = async ({ id }) => {
      // Exemplo de dados do projeto
      const datas = await new Projecto().buscar({ id })
      console.log("FINDED", datas);
      return datas[0]
    };

    const loadProject = async () => {
      const project = await fetchProjectById({ id: projectoId });
      reset(project); // Carregar dados do projeto no formulário
      setSelectedGestoresInterno(project.gestoresInternoIds);
      setSelectedGestoresExterno(project.gestoresExternoIds);
      setClienteId(project.clienteId);
    };

    loadProject();
  }, [projectoId, reset]);

  const buscarClientes = async () => {
    const res = await ClienteService.buscarClientes();
    setClientes(res);
  };

  const buscarGestorInterno = async () => {
    const interno = await Gestor.buscarTodos({ painelId: 6 });
    setGestorInterno(interno);
  };

  const buscarGestores = async () => {
    const externo = await Gestor.buscarTodos({ clienteId: clienteIdSelected || 1, painelId: 5 });
    setGestorExterno(externo);
  };

  const handleCheckboxChangeGestoresInterno = (event) => {
    const personId = parseInt(event.target.value, 10);
    setSelectedGestoresInterno((prevSelected) =>
      prevSelected.includes(personId)
        ? prevSelected.filter((id) => id !== personId)
        : [...prevSelected, personId]
    );
  };

  const handleCheckboxChangeGestoresExterno = (event) => {
    const personId = parseInt(event.target.value, 10);
    setSelectedGestoresExterno((prevSelected) =>
      prevSelected.includes(personId)
        ? prevSelected.filter((id) => id !== personId)
        : [...prevSelected, personId]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('Form Data:', data);
      // Simular edição de projeto 
      alert(projectoId)
      const response = await new Projecto().editar({ id: projectoId, data });
      console.log(response);
      setLoading(false);
      reset();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit(onSubmit)} style={{ borderRadius: "none" }}>
      <CAlert color="secondary">
        <div className="w-100 d-flex justify-content-between">
          <Typography variant="h4">Editar Projeto</Typography>
          <LoadingButton
            className="text-white px-4"
            color="success"
            type="submit"
            loading={loading}
            variant="contained"
          >
            Salvar
          </LoadingButton>
        </div>
      </CAlert>
      <SimpleCard>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              size="sm"
              type="text"
              label="Nome do Projeto"
              text={errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>}
              {...register("nome")}
            />
          </CCol>
          <CCol>
            <CFormSelect
              label="Cliente"
              size="sm"
              text={errors.clienteId && <div className="text-light bg-danger">{errors.clienteId.message}</div>}
              value={clienteIdSelected}
              disabled
            >
              {clientes.map((clien) => (
                <option value={clien.id} key={clien.id}>{clien.nome}</option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>
      </SimpleCard>
      <CRow className="mb-4 mt-4 w-100 d-flex" style={{ overflow: "auto" }}>
        <CCol md={6}>
          <SimpleCard className="custom-scrollbar">
            <Typography variant="h6">Selecione os gestores externos (Cliente)</Typography>
            {errors.gestoresExternoIds && <div className="text-light bg-danger">{errors.gestoresExternoIds.message}</div>}
            <FormGroup>
              {gestorExterno.map((gestor) => (
                <FormControlLabel
                  key={gestor.id}
                  control={
                    <Checkbox
                      value={gestor.id}
                      checked={selectedGestoresExterno?.includes(gestor.id)}
                      {...register("gestoresExternoIds")}
                      onChange={handleCheckboxChangeGestoresExterno}
                    />
                  }
                  label={gestor.nome}
                />
              ))}
            </FormGroup>
          </SimpleCard>
        </CCol>
        <CCol md={6}>
          <SimpleCard className="custom-scrollbar">
            <Typography variant="h6">Selecione os gestores internos (Metálica)</Typography>
            {errors.gestoresInternoIds && <div className="text-light bg-danger">{errors.gestoresInternoIds.message}</div>}
            <FormGroup>
              {gestorInterno.map((gestor) => (
                <FormControlLabel
                  key={gestor.id}
                  control={
                    <Checkbox
                      value={gestor.id}
                      checked={selectedGestoresInterno?.includes(gestor.id)}
                      {...register("gestoresInternoIds")}
                      onChange={handleCheckboxChangeGestoresInterno}
                    />
                  }
                  label={gestor.nome}
                />
              ))}
            </FormGroup>
          </SimpleCard>
        </CCol>
      </CRow>
    </CForm>
  );
}
