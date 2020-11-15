const express = require('express');
const cors = require('cors');
const { v4: uuid, validate } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Métodos (Verbos) HTTP:
 * 
 * GET: Buscar alguma informação do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 *      PUT => Mais utilizado para ataulizar um recurso por completo
 *      PATCH => Mais usado para dado específico.
 * DELETE: Apagar/deletar uma informação no back-end
*/

/**
 * Tipos de Parâmetros: São formas do nosso front-end,insominia ou clientes
 * enviar algum tipo de informação.
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos na hora de atualizar ou deletar;
 * Request Body: Conteúdo na hora de criar ou editar o recurso (JSON)
 * 
*/

/**
 * Middleware: É um interceptador de requisições, que pode interromper
 * totalmente a requisição ou alterar dados da requisição.
 * 
*/

const projects = [];

function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); // Chamada do Próximo Middleware

    console.timeEnd(logLabel);

}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!validate(id)){
        return response.status(400).json({ error: 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
     ? projects.filter(project => project.title.includes(title))
     : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project); 
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    }

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({ error: 'Project not found.' })
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(4444, () => {
    console.log('Back-end started!')
});