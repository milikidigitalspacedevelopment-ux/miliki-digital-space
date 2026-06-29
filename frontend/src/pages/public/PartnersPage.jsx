import PageBanner from "../../components/common/PageBanner";

function PartnersPage() {
	const partners = [
		{ id: 1, name: "Community Partners", logo: "https://via.placeholder.com/200x80?text=Partner+1" },
		{ id: 2, name: "Education Partners", logo: "https://via.placeholder.com/200x80?text=Partner+2" },
		{ id: 3, name: "Corporate Sponsors", logo: "https://via.placeholder.com/200x80?text=Partner+3" },
	];

	return (
		<>
			<PageBanner title="Our Partners" subtitle="Organizations supporting our mission" />

			<section className="container py-5">
				<div className="row g-4">
					{partners.map((p) => (
						<div className="col-6 col-md-4 text-center" key={p.id}>
							<div className="bg-white shadow-sm p-4" style={{ borderRadius: 16 }}>
								<img src={p.logo} alt={p.name} className="img-fluid mb-3" />
								<h6 className="mb-0">{p.name}</h6>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

export default PartnersPage;
