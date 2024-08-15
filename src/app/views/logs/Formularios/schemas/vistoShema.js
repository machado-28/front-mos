import { msgRequiredField } from "app/utils/constant";

const { ValidateData, validatePassporte } = require("app/utils/validate");
const { z } = require("zod");

const validadeDate = new ValidateData().byInterval;
const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });

let vistoShema = z.object({
    passaporte: z.object({
        numero: z.string().regex(validatePassporte, "Passaporte invalido!").max(9).default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
        dataEmissao: z.coerce
            .date()
            .max(validadeDate({ date: new Date() }), "data de emissão invalida!"),
        dataValidade: z.coerce.date().refine(
            (date) => {
                return date >= seisMesesNoFuturo;
            },
            { message: "o passaporte de ter pelo meno 6 meses de validade!" }
        )
    }),
    funcao: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    mob: z.coerce
        .date().min(new Date(), `data de chegada inválida!`),
    consulado: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    localProjecto: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    nomePai: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    nomeMae: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    localProjecto: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    paisOrigem: z
        .string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    enderecoAngola: z.object({
        provincia: z.string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
        comuna: z.string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
        municipio: z.string().default("xxxxxxxxxxxxxxxxxxxxxxxxxx"),
    }).default({})
});


export default vistoShema
