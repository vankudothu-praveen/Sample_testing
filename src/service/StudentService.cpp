#include "service/StudentService.hpp"
#include "exceptions/Exceptions.hpp"
#include "validation/StudentValidator.hpp"

#include <utility>

namespace studentrecords {

StudentService::StudentService(std::unique_ptr<IStudentRepository> repository)
    : repository_(std::move(repository)) {
    if (!repository_) throw std::invalid_argument("StudentService requires a repository");
}

void StudentService::addStudent(const Student& student) {
    StudentValidator::validate(student);
    repository_->addStudent(student);
}

Student StudentService::getStudent(std::string_view id) const {
    StudentValidator::validateStudentId(id);
    auto student = repository_->getStudentById(id);
    if (!student) throw StudentNotFoundException("Student not found");
    return *student;
}

std::vector<Student> StudentService::listStudents() const { return repository_->getAllStudents(); }

void StudentService::updateStudent(const Student& student) {
    StudentValidator::validate(student);
    repository_->updateStudent(student);
}

void StudentService::deleteStudent(std::string_view id) {
    StudentValidator::validateStudentId(id);
    repository_->deleteStudent(id);
}

} // namespace studentrecords
