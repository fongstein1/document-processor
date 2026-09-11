# Child Challenge V1 and deterministic child reranker

This review-only experiment froze a new 48-case prospective child challenge before implementation and froze the child reranker before the 20-case holdout. Section Challenge V1 remained historical and consumed.

The child stage preserves the flat-hybrid parent-slot sequence exactly and reranks only children assigned to the same parent slots. Its local base is `max(0, 1 - 0.01 * (withinParentHybridRank - 1))`; bonuses are capped at 0.035 and penalties at 0.020. Signals are deterministic child coverage, phrases, identifiers, roles, clauses, component consensus, and sibling distinctiveness.

Development did not pass the prefrozen efficacy thresholds. Against flat hybrid, child Target Top-1 changed from 0.5000 to 0.4643, Top-3 from 0.6429 to 0.6786, and Top-10 from 0.8214 to 0.8571. One Top-1 was damaged.

The sealed holdout also failed the efficacy gate. Target Top-1 remained 0.4000, Top-3 improved from 0.5500 to 0.6000, and Top-10 remained 0.7500. There were two improved ranks, one worsened rank, no Top-1 damage, no source/parent order changes, and zero child-residual rescues.

The result does not justify promotion or a learned reranker. The challenge and negative result should receive independent review, particularly because the prospective control labels did not all materialize as their intended observed reachability conditions.

Governance remains `reviewOnly=true`, `promotionStatus=not_promoted`, and `ragReadyAllowed=false`.
