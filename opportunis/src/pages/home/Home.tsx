import React, { ReactNode, useEffect, useState } from "react";
import Header from "../../shared/components/Header";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@mui/material";
import { VagasService } from "../../shared/services/api/vagas/VagasService";

const companyLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const getAll = async (): Promise<any | Error> => {
  const data = await VagasService.getTopVagas();

  return data;
};

const Home = () => {
  const [vagas, setVagas] = useState<
    {
      title: string;
      description: string;
      id: number;
    }[]
  >([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await VagasService.getTopVagas();
        console.debug(vagas);
        setVagas(response || []);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    getAll(); // Chama a função quando o componente for montado
  }, []); // O array vazio faz com que o useEffect rode apenas na montagem
  return (
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
        <div
          className="flex items-center justify-center text-center mx-auto"
          style={{
            width: "400px",
            height: "auto",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <img
            src="/jobs.svg"
            alt={`Logo banner`}
            style={{
              width: "400px",
              height: "auto",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "24px",
            justifyContent: "center",
          }}
        >
          {vagas.map((job, index) => (
            <Card
              key={index}
              className="bg-gray-50"
              style={{
                width: "250px",
                maxWidth: "250px",
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" className="bg-gray-50">
                    {job.title}
                  </Typography>
                }
                className="justify-center text-center"
              />
              <CardContent>
                <Typography variant="body2" className="text-center bg-gray-50">
                  {job.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "16px" }}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className=" bg-gray-50">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto justify-center flex"></div>
            </div>
          </div>
        </div>
        <Box sx={{ maxWidth: 600, my: 5, padding: 2, mx: "auto" }}>
          <Slider {...settings}>
            {companyLogos.map((logo, index) => (
              <Box
                className="box-logos"
                sx={{
                  maxWidth: 600,
                  my: 1,
                  padding: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto", // Isso ajuda a centralizar horizontalmente
                }}
              >
                <img
                  src={logo}
                  alt={`Logo ${index}`}
                  style={{ width: "100px", height: "auto" }}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </section>
    </>
  );
};

export default Home;
