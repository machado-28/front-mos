import { Bounce, toast } from "react-toastify";

export function NotifyError(message = "Erro ao realizar a operação") {
 try {
   toast.error(message, {
     position: "top-right",
     autoClose: 1000,
     hideProgressBar: true,
     closeOnClick: true,
 
     theme: "colored",
     transition: Bounce
   });
 } catch (error) {
  alert("ALGO DEU ERRADO COM TOAST", error)
 }
}

export function Notify(message = "Operação realizada com sucesso") {
  try {
    toast.success(message, {
      position: "top-right",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: true,
  
      theme: "colored",
      transition: Bounce
    });

  } catch (error) {
    alert("ALGO DEU ERRADO COM TOAST", error)
  }
}

export function NotifyInfo(message = "informação indisponivel") {
 try {
  toast.info(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,

    theme: "colored",
    transition: Bounce
  });
 } catch (error) {
  alert("ALGO DEU ERRADO COM TOAST", error)
 }
}
