import React, { useEffect, useState } from "react";
import AnimesHeader from "./animesHeader";
import ReactPaginate from "react-paginate";
import axios from "axios";

const AnimesData = () => {
    const [allData, setAllData] = useState([])
    const [data , setData] = useState([])
    const [search, updateSearch] = useState('');
    const [filterValue, setFilterValue] = useState('')

    const getAllAnimesData = async () => {
        return await axios.get("https://api.jikan.moe/v4/anime")
            .then(response => {
                console.log(response.data.data);
                setAllData(response.data.data);
                const total = response.headers.get('x-total-count')
                console.log("total",total)
            }).catch((err) => {
                console.log("Error", err)
            })
    }

//FILTER Code 
    const handleFilter = () => {
        const Filterdata = allData.filter((l) => {
            let data = `${l.genres.name} ${l.rating}`.toLowerCase()
            return data
        })
        setFilterValue(Filterdata)
        console.log("filter value=>", filterValue)
    }


    //Pagination start
    const PER_PAGE = 2;
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allData.length / PER_PAGE);

    useEffect(()=>{
        const getAllAnimesData = async (currentPage) => {
            return await axios.get(`https://api.jikan.moe/v4/anime?page=${currentPage}`)
                .then(response => {
                    console.log("pagedata",response.data);
                    setData(response.data);
                }).catch((err) => {
                    console.log("Error", err)
                })
        }
        getAllAnimesData()
    },[])
    //pagination end

    useEffect(() => {
        getAllAnimesData()
    }, [])
    return (
        <>
            <AnimesHeader />
            <div className="container-fliud overflow-hidden !important">
                <div className="row">
                    <div className="col-lg-3 mt-4">
                        <form className="d-flex">
                            <input className="form-control me-2 mx-1" type="search" placeholder="Search Data" aria-label="Search" onChange={e => updateSearch(e.target.value)} />
                        </form>
                    </div>
                    <div className="col-lg-3"></div>

                    <div className="col-lg-3 mt-4">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={filterValue} onClick={() => handleFilter()} />
                            <label className="form-check-label">
                                Filter Data By Genres
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={filterValue} onClick={() => handleFilter()} />
                            <label className="form-check-label">
                                Filter Data By Rating
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-2 mt-4">
                        <button className="btn btn-white position-relative">
                            <div className='text-center text-primary'>
                                <i className='fa fa-cart-plus fa-2x'> </i>
                            </div>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">

                                <span>+</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="my-2">
                            <table className="table table-border">
                                <thead className="text-center bg-primary text-light">
                                    <tr>
                                        <th> Id </th>
                                        <th> Title </th>
                                        <th> Rating </th>
                                        <th> Images </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allData.length > 0 ?
                                        allData.filter(listItem => {
                                            if ((listItem.title.toLowerCase().includes(search.toLowerCase()))) {
                                                return listItem;
                                            }
                                        }).slice(offset, offset + PER_PAGE).map((data, index) => {
                                            console.log("data=>", data)
                                            return (
                                                <tr key={index} className="text-center">
                                                    <td> {data.mal_id}</td>
                                                    <td>{data.title}</td>
                                                    <td>{data.rating}</td>

                                                    {" "}
                                                    {
                                                        [data].map((info, index) => {
                                                            console.log("ok", info);
                                                            return <td key={index}>
                                                                <img src={info.images.jpg.image_url} alt="img" height="150px" width="150px" />
                                                            </td>;
                                                        })}{" "}
                                                </tr>
                                            )
                                        })
                                        : <p> Loding...</p>
                                    }
                                </tbody>
                            </table>
                            <div className="mb-4 mt-4">
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination  justify-content-center"}
                            pageClassName={"page-item "}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active primary"}
                        />
                    </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AnimesData;