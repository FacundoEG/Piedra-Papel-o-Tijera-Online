DESAFÍO FINAL APX - MODULO 6

Link de acceso a la webapp en Heroku: https://p-p-t-v2.herokuapp.com

Link de la documentación de la API en postman: https://documenter.getpostman.com/view/17261810/UVJbGHZT

Webapp creada para el desafío final del modulo 6 de la carrera de programación web fullstack en APXschool.

El frontend fue diseñado para poder soportar correctamente los componentes dentro de las resoluciones de Iphone5, Iphone 6 y Desktop, con la intención de que sea responsivo para la mayor cantidad de pantallas posibles.

La arquitectura web esta basada en pages montadas como custom elements, usando vaadin como router para redirecciónar.

La escritura del codigo esta basada en funciones declarativas, describiendo al inicio de cada función que logica sucedera, los metodos para el frontend,backend y basics para manejar el state, estan detallados dentro del archivo "state.ts".

Para persistir los datos y poder recargar las paginas, se utilizo el recurso de sessionStorage, para que cada vez que el usuario cierre el navegador, los datos se pierdan y simule el volver a tener que iniciar, dandole la oportunidad de entrar y crear diferentes salas cuando lo desee.

Cada vez que el jugador cierre la pagina o recargue la pagina, su usuario dentro de la base de datos volvera al estado de "no-listo". Para que se vea obligado a volver a darse como "iniciado", evitando que la app sufra situaciones inesperadas.
