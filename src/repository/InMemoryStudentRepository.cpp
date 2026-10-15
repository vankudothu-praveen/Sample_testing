#include "repository/InMemoryStudentRepository.hpp"
#include "exceptions/Exceptions.hpp"

#include <algorithm>

namespace studentrecords {

void InMemoryStudentRepository::addStudent(const Student& student) {
    if (students_.contains(student.studentId())) throw DuplicateStudentException("Student ID already exists");
    if (emailToStudentId_.contains(student.email())) throw DuplicateStudentException("Email address already belongs to another student");
    students_.emplace(student.studentId(), student);
    emailToStudentId_.emplace(student.email(), student.studentId());
}

std::optional<Student> InMemoryStudentRepository::getStudentById(std::string_view id) const {
    const auto it = students_.find(std::string(id));
    if (it == students_.end()) return std::nullopt;
    return it->second;
}

std::vector<Student> InMemoryStudentRepository::getAllStudents() const {
    std::vector<Student> result;
    result.reserve(students_.size());
    for (const auto& [id, student] : students_) {
        (void)id;
        result.push_back(student);
    }
    std::sort(result.begin(), result.end(), [](const Student& left, const Student& right) {
        return left.studentId() < right.studentId();
    });
    return result;
}

void InMemoryStudentRepository::updateStudent(const Student& student) {
    const auto it = students_.find(student.studentId());
    if (it == students_.end()) throw StudentNotFoundException("Student not found");
    const auto emailOwner = emailToStudentId_.find(student.email());
    if (emailOwner != emailToStudentId_.end() && emailOwner->second != student.studentId())
        throw DuplicateStudentException("Email address already belongs to another student");

    const std::string oldEmail = it->second.email();
    emailToStudentId_.emplace(student.email(), student.studentId());
    it->second = student;
    if (oldEmail != student.email()) emailToStudentId_.erase(oldEmail);
}

void InMemoryStudentRepository::deleteStudent(std::string_view id) {
    const auto it = students_.find(std::string(id));
    if (it == students_.end()) throw StudentNotFoundException("Student not found");
    emailToStudentId_.erase(it->second.email());
    students_.erase(it);
}

} // namespace studentrecords
