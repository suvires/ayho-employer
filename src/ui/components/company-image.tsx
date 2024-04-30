interface IProps {
  src: string;
  editable?: boolean;
  htmlFor?: string;
}

export const CompanyImage: React.FC<IProps> = ({
  src,
  editable = false,
  htmlFor = "",
}) => {
  return (
    <div className={`company-image ${editable ? "editable" : ""}`}>
      <label htmlFor={htmlFor}>
        <span className="visually-hidden">Editar</span>
        <figure style={{ backgroundImage: `url(${src})` }}></figure>
      </label>
    </div>
  );
};
