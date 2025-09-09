import { Heart, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/charlles-augusto",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://linkedin.com/in/charlles-augusto",
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      url: "mailto:charlles.augusto@email.com",
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <img src="/logo.png" alt="Charlles Augusto Logo" className="h-8 w-auto mb-2 mx-auto md:mx-0" />
            <p className="text-muted-foreground">
              Cybersecurity &amp; Full-Stack Developer
            </p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground flex items-center justify-center">
            &copy; {currentYear} Charlles Augusto. Feito com{" "}
            <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />{" "}
            usando React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;