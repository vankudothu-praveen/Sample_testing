#include "logging/Logger.hpp"
#include "repository/InMemoryStudentRepository.hpp"
#include "service/StudentService.hpp"
#include "ui/ConsoleApplication.hpp"

#include <exception>
#include <iostream>
#include <memory>

int main() {
    try {
        studentrecords::StudentService service(
            std::make_unique<studentrecords::InMemoryStudentRepository>());
        studentrecords::ConsoleApplication app(service, std::cin, std::cout);
        app.run();
        return 0;
    } catch (const std::exception& error) {
        studentrecords::Logger::instance()->error("Application failure: {}", error.what());
        return 1;
    }
}
