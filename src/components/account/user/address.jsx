import axios from "axios";
import NewAddress from "./newAddress";
import { useEffect, useState } from "react";

const Address = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState([])
    const API_ACCESS_TOKEN = localStorage.getItem('token')

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const getAddress = async () => {
        const {data} = await axios.get('http://localhost:3000/api/delivery-addresses', {
            headers: {
                'Authorization': `Bearer ${API_ACCESS_TOKEN}`
            }
        });
        setAddress(data);
    }

    useEffect(() => {
        getAddress();
    }, [])

    return(
        <div className="h-[600px] overflow-auto">
            <button
                className="bg-main-color text-white py-1 px-3 m-2 rounded"
                onClick={openModal}
            >
                Tambah Alamat
            </button>
            <NewAddress isOpen={isModalOpen} onClose={closeModal} getAddress={getAddress}/>

            <div className="address-grid p-2 border-b-4 sticky top-0 bg-white">
                <div className="font-semibold p-4">Nama</div>
                <div className="font-semibold p-4">Detail</div>
            </div>
            {address.map((item, key) => (
                <div key={key} className="address-grid p-2 border-b-4 bg-white">
                    <div className="font-md p-4">{item.nama}</div>
                    <div className="font-md p-4">{item.kelurahan}, {item.kecamatan}, {item.kabupaten}, {item.provinsi}, {item.detail}</div>
                </div>
            ))}
        </div>
    )
}

export default Address;