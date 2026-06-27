export interface Contract {
  id: string;
  title: string;
  status: string;
  content: string;
  signedDocumentKey?: string;
  issuedAt?: string;
  createdAt?: string;
}
