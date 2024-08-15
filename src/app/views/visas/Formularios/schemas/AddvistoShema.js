import { msgRequiredField } from "app/utils/constant";

const { ValidateData, validatePassporte } = require("app/utils/validate");
const { z } = require("zod");

const validadeDate = new ValidateData().byInterval;
const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });
let AddvistoShema = z.object({
    numero: z
        .string().min(4),
    dataEmissao: z
        .coerce.date(),
    dataEntrega: z
        .coerce.date(),
});


export default AddvistoShema
