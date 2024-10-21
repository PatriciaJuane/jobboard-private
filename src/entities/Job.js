export class Job {
  constructor(
    id,
    title,
    company_name,
    location,
    seniority,
    savingRateFrugal,
    savingRateComfortable,
    createdAt,
    country,
    url,
    workplace_type
  ) {
    this.id = id;
    this.title = title;
    this.company_name = company_name;
    this.location = location;
    this.seniority = seniority;
    this.savingRateFrugal = savingRateFrugal;
    this.savingRateComfortable = savingRateComfortable;
    this.createdAt = createdAt;
    this.country = country;
    this.url = url;
    this.workplace_type = workplace_type;
  }

  // Utility methods
  getFormattedSalary() {
    return this.salary ? `$${this.salary.toLocaleString()}` : 'Not specified';
  }

  getFormattedPostDate() {
    return this.postDate.toLocaleDateString();
  }
}