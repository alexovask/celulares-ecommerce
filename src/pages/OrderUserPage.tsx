import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "../hooks";
import { Loader } from "../components/shared/Loader";
import { IoChevronBack } from "react-icons/io5";
import { formatDateLong, formatPrice } from "../helpers";

const tableHeaders = ["producto", "contidad", "Total"];

export const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id!));
  const navigate = useNavigate();

  if (isLoading || !order) return <Loader />;

  return (
    <div>
      <div className="flex flex-col justify-between items gap-5 md:flex-row md:gap-0">
        <button
          className="border rounded-full py-2 border-slate-200 px-5 flex items-center justify-center gap-2 text-xs
		 font-medium uppercase tracking-widest hover:bg-stone-100 transition-all"
          onClick={() => navigate(-1)}
        >
          <IoChevronBack size={16} />
          Volver a los pedidos
        </button>
        <div className="flex flex-col item-center gap-1.5">
          <h1 className="text-3xl font-bold">Pedido #{id}</h1>
          <p className="text-sm">{formatDateLong(order.createdAt)}</p>
        </div>
        <div></div>
        <div></div>
      </div>
      <div className="flex flex-col mt-10 mb-5 gap-10">
        <table className="text-sm w-full caption-bottom overflow-auto">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="h-12 text-center uppercase tracking-wide text-stone-600 font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((product, item) => (
              <tr key={item} className="border-b border-gray-200">
                <td className="p-4 font-medium tracking-tighter flex items-center gap-3">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <div className="space-y-2 ">
                    <h3>{product.productName}</h3>
                    <p className="text-xs">
                      {product.color_name} / {product.storage}
                    </p>
                    <p className="text-xs">{formatPrice(product.price)}</p>
                  </div>
                </td>
                <td className="p-4 font-medium tracking-tighter text-center">
                  {product.quantity}
                </td>
                <td className="p-4 font-medium tracking-tighter text-center">
                  {formatPrice(product.price * product.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col gap-3 text-slate-600 text-sm self-end w-1/2">
          <div className="flex justify-between">
            <p> Envio (standard)</p>
            <p>{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between text-black font-medium">
            <p>Total</p>
            <p>{formatPrice(order.totalAmount)}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Dirección</h2>

          <div className="border border-stone-500 p-5 flex flex-col gap-5">
            <div className="space-y-1">
              <h3>Cliente:</h3>
              <p>{order.customer.full_name}</p>
            </div>
            <div className="space-y-1">
              <h3>Envío:</h3>
              <p>{order.address.addressLine1}</p>
              <p>{order.address.city}</p>
              <p>{order.address.state}</p>
              <p>{order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
