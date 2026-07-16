const DEFAULT_IMPACT_STATS = {
  stats: {
    years: 1,
    communities: 0,
    graduates: 0,
    livesImpacted: 0,
    jobsCreated: 0,
  },
  growthOverTime: [],
};

export const buildImpactStats = async (queryFn = async () => null) => {
  try {
    const [yearsResult, communitiesResult, graduatesResult, livesResult, jobsResult, growthResult] = await Promise.all([
      queryFn("SELECT EXTRACT(YEAR FROM AGE(NOW(), COALESCE(MIN(created_at), NOW())))::int AS years FROM users"),
      queryFn("SELECT COUNT(DISTINCT NULLIF(location, '')) AS communities FROM events"),
      queryFn("SELECT COUNT(*) AS graduates FROM certificates"),
      queryFn("SELECT COUNT(*) AS lives_impacted FROM users"),
      queryFn("SELECT COUNT(*) AS jobs_created FROM volunteers"),
      queryFn(`SELECT TO_CHAR(DATE_TRUNC('month', published_at), 'YYYY-MM') AS month,
              COUNT(*)::int AS value
       FROM certificates
       WHERE published_at IS NOT NULL
       GROUP BY month
       ORDER BY month ASC
       LIMIT 12`),
    ]);

    return {
      stats: {
        years: Number(yearsResult?.rows?.[0]?.years || 1),
        communities: Number(communitiesResult?.rows?.[0]?.communities || 0),
        graduates: Number(graduatesResult?.rows?.[0]?.graduates || 0),
        livesImpacted: Number(livesResult?.rows?.[0]?.lives_impacted || 0),
        jobsCreated: Number(jobsResult?.rows?.[0]?.jobs_created || 0),
      },
      growthOverTime: (growthResult?.rows || []).map((row) => ({ month: row.month, value: Number(row.value) })),
    };
  } catch (error) {
    console.error("Impact stats query failed", error);
    return DEFAULT_IMPACT_STATS;
  }
};
