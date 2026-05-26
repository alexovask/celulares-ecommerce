import { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks";
import { formatDateShort, formatPrice } from "../../../helpers";
import { Loader } from "../../shared/Loader";
import { Pagination } from "../../shared/Pagination";
import { CellTableProduct } from "./CellTableProduct";

const tableheaders = [
  "",
  "Nombre",
  "Variante",
  "Precio",
  "Stock",
  "Fecha de creación",
  "",
];

export const TableProduct = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVarian, setSelectedVarian] = useState<{
    [key: string]: number;
  }>({});
  const [page, setpage] = useState(1);
  const { products, isLoading, totalProducts } = useProducts({ page });

  const handleMenuToggle = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(index);
    }
  };

  const handleVariantChange = (productId: string, variantIndex: number) => {
    setSelectedVarian({
      ...selectedVarian,
      [productId]: variantIndex,
    });
  };

  const handleDeleteProduct = (id: string) => {
    console.log("Eliminar producto con ID:", id);
  };

  if (!products || isLoading || !totalProducts) return <Loader />;

  return (
    <div className="flex flex-col flex-1 border border-gray-200 rounded-lg p-5 bg-white">
      <h1 className="font-bold text-xl">Productos</h1>
      <p>Gestiona tus productos y estadisticas de ventas</p>
      {/* Tabla de productos */}
      <div className="relative w-full h-full">
        <table className="text-sm w-full caption-bottom overflow-auto">
          <thead className="border-b border-gray-200 pb-3">
            <tr className="text-sm font-bold">
              {tableheaders.map((header, index) => (
                <th key={index} className="h-12 px-4 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const selectedVariantIndex = selectedVarian[product.id] ?? 0;
              const selectedVariant = product.variants[selectedVariantIndex];
              return (
                <tr>
                  <td className="p-4 align-middle sm:table-cell">
                    <img
                      src={
                        product.images[0] ||
                        "https//ui.shadcn.com/placeholder.svg"
                      }
                      alt="Imagen de producto"
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 aspect-square object-contain rounded-md"
                    />
                  </td>
                  <CellTableProduct content={product.name} />
                  <td className="p-4 font-medium tracking-tighter">
                    <select
                      className="border border-gray-300 rounded-md p-1 w-full"
                      onChange={(e) =>
                        handleVariantChange(product.id, Number(e.target.value))
                      }
                      value={selectedVariantIndex}
                    >
                      {product.variants.map((variant, varianIndex) => (
                        <option key={variant.id} value={varianIndex}>
                          {variant.color_name} - {variant.storage}
                        </option>
                      ))}
                    </select>
                  </td>

                  <CellTableProduct
                    content={formatPrice(selectedVariant.price)}
                  />
                  <CellTableProduct
                    content={selectedVariant.stock.toString()}
                  />
                  <CellTableProduct
                    content={formatDateShort(product.created_at)}
                  />

                  <td className="relative">
                    <button
                      className="text-slate-900"
                      onClick={() => handleMenuToggle(index)}
                    >
                      <FaEllipsis />
                    </button>
                    {openMenuIndex === index && (
                      <div
                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[120px]"
                        role="menu"
                      >
                        <Link
                          to={`/dashboard/productos/editar/${product.slug}`}
                          className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Editar
                          <HiOutlineExternalLink
                            size={13}
                            className="inline-block"
                          />
                        </Link>
                        <button
                          className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                          <IoTrashOutline size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <Pagination page={page} setPage={setpage} totalItems={totalProducts} />
    </div>
  );
};
