import { useEffect, useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import partnerService from "../../services/partnerService";

function PartnersPage() {
	const [partners, setPartners] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPartners = async () => {
			try {
				setLoading(true);
				const response = await partnerService.listPartners({ perPage: 12 });
				const payload = Array.isArray(response) ? response : response?.items || [];
				setPartners(payload);
			} catch (error) {
				console.error(error);
				setPartners([]);
			} finally {
				setLoading(false);
			}
		};

		loadPartners();
	}, []);

	return (
		<>
			<PageBanner title="Our Partners" subtitle="Organizations supporting our mission" />

			<section className="container py-5">
				{loading ? (
					<div className="text-center text-muted">Loading partners...</div>
				) : partners.length === 0 ? (
					<div className="text-center text-muted">No partners available right now.</div>
				) : (
					<div className="row g-4">
						{partners.map((p) => (
							<div className="col-6 col-md-4 text-center" key={p.id}>
								<div className="bg-white shadow-sm p-4" style={{ borderRadius: 16 }}>
									<img src={p.logo_url || p.logo || "/images/partner-placeholder.png"} alt={p.name} className="img-fluid mb-3" />
									<h6 className="mb-0">{p.name}</h6>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</>
	);
}

export default PartnersPage;
