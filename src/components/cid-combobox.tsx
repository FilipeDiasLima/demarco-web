"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CidData {
  code: string;
  description: string;
}

interface CidComboboxProps {
  open: boolean;
  selectedCid?: CidData;
  setOpen: (isOpen: boolean) => void;
  setSelectedCid: (cid: CidData | undefined) => void;
}

export function CidCombobox({
  open,
  selectedCid,
  setOpen,
  setSelectedCid,
}: CidComboboxProps) {
  const { handleError } = useErrorHandler();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedCid, setSearchedCid] = useState<CidData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCache, setSearchCache] = useState<
    Record<string, { result: CidData | null; searched: boolean }>
  >({});

  const handleCidSelect = (cid: CidData) => {
    if (selectedCid?.code === cid.code) {
      setSelectedCid(undefined);
    } else {
      setSelectedCid(cid);
    }
    setOpen(false);
  };

  const getDisplayText = () => {
    if (!selectedCid) {
      return "Selecione um CID";
    } else {
      return `${selectedCid.code} - ${selectedCid.description}`;
    }
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    const searchCidDebounced = async (id: string) => {
      if (!id.trim()) {
        setSearchedCid(null);
        setHasSearched(false);
        return;
      }

      // Verifica se já temos o resultado no cache
      const cachedResult = searchCache[id.trim()];
      if (cachedResult) {
        setSearchedCid(cachedResult.result);
        setHasSearched(cachedResult.searched);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await api.get(`/cids/${id}`);
        const cidResult = response.data.cid;

        // Armazena o resultado no cache
        setSearchCache((prev) => ({
          ...prev,
          [id.trim()]: { result: cidResult, searched: true },
        }));

        setSearchedCid(cidResult);
      } catch (error) {
        setSearchCache((prev) => ({
          ...prev,
          [id.trim()]: { result: null, searched: true },
        }));

        setSearchedCid(null);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchCidDebounced(searchValue);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchValue, handleError, searchCache]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {getDisplayText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite o código CID..."
            value={searchValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Buscando CID...
              </div>
            )}

            {!isLoading &&
              hasSearched &&
              !searchedCid &&
              searchValue.trim() && (
                <CommandEmpty>
                  Nenhum CID encontrado para "{searchValue}".
                </CommandEmpty>
              )}

            {!isLoading && !hasSearched && !searchValue.trim() && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                Digite um código CID para buscar
              </div>
            )}

            {!isLoading && searchedCid && (
              <CommandGroup>
                <CommandItem
                  key={searchedCid.code}
                  value={`${searchedCid.code} ${searchedCid.description}`}
                  onSelect={() => handleCidSelect(searchedCid)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCid?.code === searchedCid.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{searchedCid.code}</span>
                    <span className="text-sm text-muted-foreground">
                      {searchedCid.description}
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
