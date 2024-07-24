/// <reference types="cypress" />
import { faker } from '@faker-js/faker';


import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
  let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    })     

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => { 
    cy.request({
      method: 'GET',
      url: 'usuarios'
  }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
     
  })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "fulano tres4",
        "email": "fulano.tres4@qa.com.br",
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).then(response => {
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.status).to.equal(201)
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "fulano dois",
        "email": "fulano.doi#qa.com.br",
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.equal(400)
      expect(response.body.email).to.equal('email deve ser um email válido')
      
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[3]._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        headers: {authorization: token},
        body:{
          "nome": "Jefferson Sertao01",
          "email": "jeff01@qa.com.br",
          "password": "teste",
          "administrador": "true"
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[3]._id
      cy.request({
        method: 'Delete',
        url: `usuarios/${id}`,
        headers: {authorization: token}

      }).then (response => {
        expect(response.status).to.equal(200)
      })

    })
  });
});
