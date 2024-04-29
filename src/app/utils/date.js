const hoje = new Date();
const tresMesesAtras = new Date();
tresMesesAtras.setMonth(hoje.getMonth() - 3);

const schemaVisto = z.object({
  dataEmissao: z.coerce
    .date()
    .min(tresMesesAtras, "Data não pode ser mais do que 3 meses no passado")
    .max(hoje, "Data não pode estar no futuro"),
  numeroPassaporte: z
    .string()
    .regex(/^([a-zA-Z]{2}\d{7})$/, "Número do passaporte inválido")
    .max(9)
});
