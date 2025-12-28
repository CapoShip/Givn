SELECT
  id,
  slug,
  name,
  logo_url,
  website,
  STATUS,
  (
    SELECT
      max(p.occurred_at) AS max
    FROM
      proofs p
    WHERE
      (
        (p.brand_id = b.id)
        AND (p.published = TRUE)
      )
  ) AS last_proof_at,
  (
    SELECT
      count(*) AS count
    FROM
      proofs p
    WHERE
      (
        (p.brand_id = b.id)
        AND (p.published = TRUE)
      )
  ) AS proof_count,
  compute_trust_score(id) AS trust_score
FROM
  brands b;