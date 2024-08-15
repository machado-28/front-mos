import { msgRequiredField } from "app/utils/constant";

const { ValidateData, validatePassporte } = require("app/utils/validate");
const { z } = require("zod");

const validadeDate = new ValidateData().byInterval;
const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });

const updateProcessoShema = z.object({
    passaporte: z.object({
        numero: z.string().regex(validatePassporte, "Passaporte invalido!").max(9),
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
        .string().min(1, msgRequiredField),
    mob: z
        .date().min(new Date(), `data de chegada inválida!`),
    consulado: z
        .string().min(1, msgRequiredField),
    localProjecto: z
        .string().min(1, msgRequiredField),
});
export default updateProcessoShema