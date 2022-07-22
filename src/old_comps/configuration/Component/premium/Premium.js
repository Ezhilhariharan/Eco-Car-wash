

const Premium = () => {
    return(
        <div className="w-100">
        <div className="d-flex flex-row p-4">
        <h5 className="mx-auto">Premium</h5>
        <a className="nav-item btn-config me-3" data-bs-toggle="modal" data-bs-target="#exampleModal">+ Add</a>
        </div>
        <div className="p-5">
            <p>
            Fabric cleaning / CHF 15 - $200
            </p>
            <p>
            Interior disinfection / CHF 24 - $100
            </p>
        </div>
    </div>
    )
}

export default Premium;