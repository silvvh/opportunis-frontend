import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  IListagemEmpresa,
  EmpresasService,
} from "../../shared/services/api/empresas/EmpresasService";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import { Environment } from "../../shared/environment";
import { Delete, Edit } from "@mui/icons-material";

export const ListagemDeEmpresas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemEmpresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(
    () => Number(searchParams.get("pagina") || "1"),
    [searchParams]
  );

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      EmpresasService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [busca, debounce, pagina]);

  const handleDelete = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Realmente deseja apagar?")) {
      EmpresasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows((oldRows) => oldRows.filter((oldRow) => oldRow.id !== id));
          alert("Registro apagado com sucesso!");
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo="Empresas"
      barraDeFerramentas={
        <FerramentasDaListagem
          textoDaBusca={busca}
          textoBotaoNovo="Novo"
          aoClicarEmNovo={() => navigate("/admin-dashboard/empresa/novo")}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <div className="m-4 rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-3 px-4 text-left">Ações</th>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Telefone</th>
                <th className="py-3 px-4 text-left">CNPJ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-gray-500 mx-1 hover:text-red-600"
                    >
                      <Delete />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/empresa/${row.id}`)
                      }
                      className="text-gray-500  mx-1 hover:text-[#f8b503]"
                    >
                      <Edit />
                    </button>
                  </td>
                  <td className="py-3 px-4">{row.name}</td>
                  <td className="py-3 px-4">{row.email}</td>
                  <td className="py-3 px-4">{row.telephone}</td>
                  <td className="py-3 px-4">{row.cnpj}</td>
                </tr>
              ))}
            </tbody>
            {totalCount === 0 && !isLoading && (
              <tfoot>
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    {Environment.LISTAGEM_VAZIA}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="p-4 flex justify-between items-center">
          {isLoading && <div className="text-blue-500">Carregando...</div>}
          {totalCount > 0 && (
            <Pagination
              page={pagina}
              count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
              onChange={(_, newPage) =>
                setSearchParams(
                  { busca, pagina: newPage.toString() },
                  { replace: true }
                )
              }
            />
          )}
        </div>
      </div>
    </LayoutBaseDePagina>
  );
};
