import { msgRequiredField } from "app/utils/constant";

const { ValidateData, validatePassporte } = require("app/utils/validate");
const { z } = require("zod");
let AddStatusShema = z.object({
    nome: z
        .string().min(2),
});
 

export default AddStatusShema
