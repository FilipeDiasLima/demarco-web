import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { usePageTitle } from "@/hooks/use-page-title";
import type { MedicalCertificateProps } from "@/interface/medical";
import { api } from "@/services/api";
import dayjs from "dayjs";
import { Calendar, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalCertificate = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const [medicalCertificates, setMedicalCertificates] = useState<
    MedicalCertificateProps[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAtestados = medicalCertificates.filter((atestado) => {
    const matchesSearch =
      atestado.collaboratorId.fullname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      atestado.cid.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredAtestados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAtestados = filteredAtestados.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const calculateEndDate = (startDate: string, days: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days - 1);
    return date.toLocaleDateString("pt-BR");
  };

  const fetchMedicalCertificates = async () => {
    try {
      const response = await api.get("/medical-certificates/all");
      setMedicalCertificates(response.data.medicalCertificates);
    } catch (error) {
      handleError(error);
    }
  };

  usePageTitle({ title: "Atestados Médicos" });

  useEffect(() => {
    fetchMedicalCertificates();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Atestados Médicos
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os atestados médicos da empresa
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por colaborador ou CID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => navigate("/dashboard/medical-certificate/new")}
            className="flex items-center gap-2 bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Novo Atestado
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>CID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAtestados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum atestado cadastrado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAtestados.map((atestado) => (
                  <TableRow key={atestado._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {atestado.collaboratorId.fullname}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {dayjs(atestado.createdAt).format("DD/MM/YYYY - HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {calculateEndDate(
                          atestado.createdAt,
                          atestado.leaveDays
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {atestado.leaveDays}{" "}
                        {atestado.leaveDays === 1 ? "dia" : "dias"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">
                        {atestado.cid.code} - {atestado.cid.description}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a{" "}
                {Math.min(startIndex + itemsPerPage, filteredAtestados.length)}{" "}
                de {filteredAtestados.length} atestados
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicalCertificate;
