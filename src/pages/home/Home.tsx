/* eslint-disable jsx-a11y/anchor-is-valid */
// src/components/Home.js
import React from "react";
import Header from "../../shared/components/Header";
import { Link } from "react-router-dom";

const Home = () => (
  <>
    <Header />
    <section className="pt-12 bg-gray-50 sm:pt-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="px-6 text-sm text-gray-900 font-inter">
            Seu primeiro passo rumo à carreira dos sonhos começa aqui
          </h1>
          <p className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
            Transforme talentos em carreiras de
            <span className="relative inline-flex sm:inline">
              <span className="relative"> sucesso </span>
            </span>
          </p>
          <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
            <Link
              to="/candidate-register"
              className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
            >
              Procurar vagas
            </Link>
            <Link
              to="/company-register"
              className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-lg font-bold text-gray-900 transition-all duration-200 border-2 border-gray-400 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900"
            >
              Anunciar vagas
            </Link>
          </div>
        </div>
      </div>
      <div className=" bg-white">
        <div className="relative">
          <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
          <div className="relative mx-auto">
            <div className="lg:max-w-6xl lg:mx-auto justify-center flex"></div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Home;
