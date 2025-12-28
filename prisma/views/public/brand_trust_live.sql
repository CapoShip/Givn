WITH proof_stats AS (
  SELECT
    b_1.id AS brand_id,
    count(DISTINCT p.id) AS proofs_total
  FROM
    (
      brands b_1
      LEFT JOIN proofs p ON ((p.brand_id = b_1.id))
    )
  GROUP BY
    b_1.id
),
event_stats AS (
  SELECT
    e.brand_id,
    count(*) FILTER (
      WHERE
        ((e.event_type) :: text = 'proof_submitted' :: text)
    ) AS submitted_count,
    count(*) FILTER (
      WHERE
        (
          (e.event_type) :: text = 'verification_verified' :: text
        )
    ) AS verified_count,
    count(*) FILTER (
      WHERE
        (
          (e.event_type) :: text = 'verification_rejected' :: text
        )
    ) AS rejected_count,
    count(*) FILTER (
      WHERE
        (
          (e.event_type) :: text = 'verification_disputed' :: text
        )
    ) AS disputed_count,
    max(e.created_at) AS last_event_at,
    (
      array_agg(
        e.event_type
        ORDER BY
          e.created_at DESC
      )
    ) [1] AS last_event_type
  FROM
    proof_events e
  GROUP BY
    e.brand_id
)
SELECT
  b.id,
  b.slug,
  b.name,
  b.logo_url,
  b.website,
  b.is_demo,
  b.demo_disclaimer,
  COALESCE(ps.proofs_total, (0) :: bigint) AS proofs_total,
  COALESCE(es.submitted_count, (0) :: bigint) AS submitted_count,
  COALESCE(es.verified_count, (0) :: bigint) AS verified_count,
  COALESCE(es.rejected_count, (0) :: bigint) AS rejected_count,
  COALESCE(es.disputed_count, (0) :: bigint) AS disputed_count,
  es.last_event_type,
  es.last_event_at,
  (
    LEAST(
      (100) :: bigint,
      GREATEST(
        (0) :: bigint,
        (
          (
            (
              (
                (
                  20 + (COALESCE(es.verified_count, (0) :: bigint) * 15)
                ) - (COALESCE(es.rejected_count, (0) :: bigint) * 20)
              ) - (COALESCE(es.disputed_count, (0) :: bigint) * 10)
            ) + (COALESCE(es.submitted_count, (0) :: bigint) * 5)
          ) - CASE
            WHEN (es.last_event_at IS NULL) THEN 20
            WHEN (es.last_event_at < (NOW() - '90 days' :: INTERVAL)) THEN 15
            WHEN (es.last_event_at < (NOW() - '30 days' :: INTERVAL)) THEN 8
            ELSE 0
          END
        )
      )
    )
  ) :: integer AS trust_score
FROM
  (
    (
      brands b
      LEFT JOIN proof_stats ps ON ((ps.brand_id = b.id))
    )
    LEFT JOIN event_stats es ON ((es.brand_id = b.id))
  );