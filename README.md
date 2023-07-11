# Estudante Voluntário - Back End
<header>
   <ul>
     <li>Universidade Federal do Paraná - UFPR</li>
     <li>Setor de Educação Profissional e Tecnológica - SEPT</li>
     <li>Tecnologia em Análise e Desenvolvimento de Sistemas</li>
     <li>DS960 - TCC-2 - N6</li>
     <li>Orientador: Prof. Dr. Alexander Robert Kutzke</li>   
     <li>GRR20175466 - Amanda Regina de Oliveira Mazurok</li>
     <li>GRR20184614 - Gustavo de Oliveira Achinitz</li>
    </ul>
 </header>
 
## Introdução 
Aplicação desenvolvida como Trabalho de Conclusão do Curso de Tecnologia em Análise e Desenvolvimento de Sistemas, da Universidade Federal do Paraná.

## Sobre o Projeto
O projeto consiste em uma aplicação web para gerenciamento de vagas de trabalho voluntário, que permita que as entidades ofertem as suas vagas e que os estudantes de graduação possam se inscrever nelas e utilizar as horas trabalhadas para comprovação de atividade formativa.

A aplicação possui três perfis de usuários:
<ul>
  <li>Estudante</li>
  <li>Entidade</li>
  <li>Administrador</li>
</ul>

### Funcionamento do Projeto
![Funcionamento][def]

## Tecnologias Utilizadas
### Back end
<ul>
  <li>Node.js</li>
  <li>Express,js</li>
  <li>Mongoose 6.4.0</li>
  <li>JsonWebToken 8.5.1</li>
  <li>Nodemailer 6.9.3</li>
  <li>bcrypt</li>
  <li>pdfmake</li>
</ul>

### Banco de Dados
MongoDB Compass

### Pré Requisitos
<ul>
  <li>GitHub instalado e configurado</li>
  <li>
    [npm] ( https://www.npmjs.com/package/node )
  </li>
  <li> 
    [nodemon]  ( https://www.npmjs.com/package/nodemon )
  </li>
  <li>
    [mongoDb] <a href="https://www.mongodb.com/try/download/community">Download MongoDb</a>
  </li>
</ul>


#### Instalar o Node.Js
`npm install node`

#### Instalar o Nodemon
`npm install nodemon`

#### Instalar o Mongoose
`npm install mongoose`

#### Instalar o dotenv
```
#instalar localmente
npm install dotenv --save`
```

Adicionar as seguintes variáveis no arquivo .env:
```javascript
APP_URL=http://localhost:3000
MONGODB_USERNAME=
MONGODB_PASSWORD=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

#### Clonar repositório
`git clone https://github.com/akmazurok/back.git`

#### Entrar na pasta do projeto
`cd back`

#### Instalar dependências
`npm install`

#### Executar o projeto
`npm start run:dev`

#### Executando o Projeto
O sistema está sendo executado em `localhost:3000`

#### Interrompendo a Execução
Apertar as teclas do seu teclado Ctrl + C juntas no terminal

[def]: src/config/funcionamento-tcc.gif